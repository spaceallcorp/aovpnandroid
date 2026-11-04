// Copyright (c) Tailscale Inc & AUTHORS
// SPDX-License-Identifier: BSD-3-Clause

package com.tailscale.ipn.ui.view

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tailscale.ipn.ui.theme.SpaceDarkBg
import com.tailscale.ipn.ui.theme.SpaceDarkBorder
import com.tailscale.ipn.ui.theme.SpaceDarkCard
import com.tailscale.ipn.ui.theme.SpaceDarkSurface
import com.tailscale.ipn.ui.theme.SpaceEmeraldContainer
import com.tailscale.ipn.ui.theme.SpaceEmeraldLight
import com.tailscale.ipn.ui.theme.SpaceEmeraldPrimary
import com.tailscale.ipn.ui.theme.SpaceRedOffline
import com.tailscale.ipn.ui.theme.SpaceTextPrimary
import com.tailscale.ipn.ui.theme.SpaceTextSecondary

data class RegionalMapNode(
    val id: String,
    val name: String,
    val location: String,
    val isOnline: Boolean,
    val pingMs: Int,
    val xRatio: Float,
    val yRatio: Float
)

val defaultRegionalNodes =
    listOf(
        RegionalMapNode("luanda-1", "Luanda Core 01", "Luanda, Angola", true, 12, 0.38f, 0.35f),
        RegionalMapNode("luanda-2", "Luanda Edge 02", "Luanda, Angola", true, 15, 0.45f, 0.38f),
        RegionalMapNode("benguela", "Benguela Hub", "Benguela, Angola", true, 22, 0.34f, 0.52f),
        RegionalMapNode("lubango", "Lubango Node", "Huíla, Angola", true, 28, 0.39f, 0.65f),
        RegionalMapNode("joburg", "Joburg Gateway", "Joanesburgo, África do Sul", true, 45, 0.78f, 0.85f),
        RegionalMapNode("cabinda", "Cabinda Relay", "Cabinda, Angola", false, 0, 0.32f, 0.20f))

@Composable
fun RegionalMapExitNodeView(
    nodes: List<RegionalMapNode> = defaultRegionalNodes,
    onSelectNode: (RegionalMapNode) -> Unit = {}
) {
  var selectedNode by remember { mutableStateOf<RegionalMapNode?>(nodes.firstOrNull()) }

  Card(
      modifier =
          Modifier.fillMaxWidth()
              .border(1.dp, SpaceDarkBorder, RoundedCornerShape(20.dp)),
      shape = RoundedCornerShape(20.dp),
      colors = CardDefaults.cardColors(containerColor = SpaceDarkCard)) {
        Column(modifier = Modifier.padding(16.dp)) {

          // Title Header
          Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically) {
                Column {
                  Text(
                      text = "Mapa Regional de Exit Nodes",
                      style =
                          MaterialTheme.typography.titleMedium.copy(
                              fontWeight = FontWeight.Bold, color = SpaceTextPrimary))
                  Text(
                      text = "Região Austral de África / Angola",
                      style =
                          MaterialTheme.typography.bodySmall.copy(
                              color = SpaceTextSecondary))
                }

                Surface(
                    shape = RoundedCornerShape(50),
                    color = SpaceEmeraldContainer) {
                      Row(
                          verticalAlignment = Alignment.CenterVertically,
                          modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)) {
                            Box(
                                modifier =
                                    Modifier.size(6.dp)
                                        .clip(CircleShape)
                                        .background(SpaceEmeraldPrimary))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "LIVE MAP",
                                style =
                                    MaterialTheme.typography.labelSmall.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = SpaceEmeraldLight))
                          }
                    }
              }

          Spacer(modifier = Modifier.height(16.dp))

          // Lightweight SVG / Canvas Map View
          Box(
              modifier =
                  Modifier.fillMaxWidth()
                      .height(240.dp)
                      .clip(RoundedCornerShape(16.dp))
                      .background(SpaceDarkBg)
                      .border(1.dp, SpaceDarkBorder, RoundedCornerShape(16.dp))) {

                // Vector Map Canvas Background
                Canvas(modifier = Modifier.fillMaxSize()) {
                  val w = size.width
                  val h = size.height

                  // Draw subtle Africa / Regional outline path
                  val mapPath =
                      Path().apply {
                        moveTo(w * 0.25f, h * 0.1f)
                        lineTo(w * 0.55f, h * 0.12f)
                        lineTo(w * 0.70f, h * 0.25f)
                        lineTo(w * 0.85f, h * 0.50f)
                        lineTo(w * 0.75f, h * 0.88f)
                        lineTo(w * 0.60f, h * 0.95f)
                        lineTo(w * 0.40f, h * 0.85f)
                        lineTo(w * 0.25f, h * 0.60f)
                        lineTo(w * 0.20f, h * 0.35f)
                        close()
                      }
                  drawPath(
                      path = mapPath,
                      color = SpaceDarkSurface,
                      style = Stroke(width = 1.5f * density))

                  // Grid Lines for high-tech aesthetic
                  for (i in 1..4) {
                    drawLine(
                        color = SpaceDarkBorder.copy(alpha = 0.4f),
                        start = Offset(0f, h * (i / 5f)),
                        end = Offset(w, h * (i / 5f)),
                        strokeWidth = 1f)
                    drawLine(
                        color = SpaceDarkBorder.copy(alpha = 0.4f),
                        start = Offset(w * (i / 5f), 0f),
                        end = Offset(w * (i / 5f), h),
                        strokeWidth = 1f)
                  }

                  // Connection lines between Angola nodes and Joburg
                  val luanda = nodes.find { it.id == "luanda-1" }
                  val joburg = nodes.find { it.id == "joburg" }
                  if (luanda != null && joburg != null) {
                    drawLine(
                        color = SpaceEmeraldPrimary.copy(alpha = 0.35f),
                        start = Offset(w * luanda.xRatio, h * luanda.yRatio),
                        end = Offset(w * joburg.xRatio, h * joburg.yRatio),
                        strokeWidth = 2f)
                  }
                }

                // Interactive Node Dots overlaid on canvas
                nodes.forEach { node ->
                  Box(
                      modifier =
                          Modifier.align(Alignment.TopStart)
                              .padding(
                                  start = (node.xRatio * 260).dp,
                                  top = (node.yRatio * 200).dp)
                              .size(28.dp)
                              .clickable { selectedNode = node },
                      contentAlignment = Alignment.Center) {

                        val isSelected = selectedNode?.id == node.id
                        val dotColor = if (node.isOnline) SpaceEmeraldPrimary else SpaceRedOffline

                        if (isSelected) {
                          Box(
                              modifier =
                                  Modifier.size(24.dp)
                                      .clip(CircleShape)
                                      .background(dotColor.copy(alpha = 0.25f)))
                        }

                        Box(
                            modifier =
                                Modifier.size(if (isSelected) 12.dp else 10.dp)
                                    .clip(CircleShape)
                                    .background(dotColor)
                                    .border(
                                        2.dp,
                                        if (isSelected) Color.White else SpaceDarkBg,
                                        CircleShape))
                      }
                }
              }

          Spacer(modifier = Modifier.height(14.dp))

          // Selected Node Detail View Card
          selectedNode?.let { node ->
            AnimatedVisibility(visible = true, enter = fadeIn(), exit = fadeOut()) {
              Surface(
                  modifier =
                      Modifier.fillMaxWidth()
                          .border(1.dp, SpaceDarkBorder, RoundedCornerShape(14.dp)),
                  shape = RoundedCornerShape(14.dp),
                  color = SpaceDarkSurface) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically) {
                          Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                              Box(
                                  modifier =
                                      Modifier.size(8.dp)
                                          .clip(CircleShape)
                                          .background(
                                              if (node.isOnline) SpaceEmeraldPrimary
                                              else SpaceRedOffline))
                              Spacer(modifier = Modifier.width(8.dp))
                              Text(
                                  text = node.name,
                                  style =
                                      MaterialTheme.typography.titleSmall.copy(
                                          fontWeight = FontWeight.Bold, color = SpaceTextPrimary))
                            }
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = node.location,
                                style =
                                    MaterialTheme.typography.bodySmall.copy(
                                        color = SpaceTextSecondary))
                          }

                          Column(horizontalAlignment = Alignment.End) {
                            if (node.isOnline) {
                              Text(
                                  text = "${node.pingMs} ms",
                                  style =
                                      MaterialTheme.typography.labelLarge.copy(
                                          fontWeight = FontWeight.Bold,
                                          color = SpaceEmeraldLight))
                              Spacer(modifier = Modifier.height(4.dp))
                              Button(
                                  onClick = { onSelectNode(node) },
                                  contentPadding = PaddingValues(horizontal = 12.dp, vertical = 0.dp),
                                  modifier = Modifier.height(30.dp),
                                  shape = RoundedCornerShape(50),
                                  colors =
                                      ButtonDefaults.buttonColors(
                                          containerColor = SpaceEmeraldPrimary)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                      Text(
                                          text = "Ligar",
                                          style =
                                              MaterialTheme.typography.labelSmall.copy(
                                                  fontWeight = FontWeight.Bold))
                                      Spacer(modifier = Modifier.width(4.dp))
                                      Icon(
                                          imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                                          contentDescription = null,
                                          modifier = Modifier.size(12.dp))
                                    }
                                  }
                            } else {
                              Surface(
                                  shape = RoundedCornerShape(50),
                                  color = SpaceRedOffline.copy(alpha = 0.15f)) {
                                    Text(
                                        text = "OFFLINE",
                                        style =
                                            MaterialTheme.typography.labelSmall.copy(
                                                fontWeight = FontWeight.Bold,
                                                color = SpaceRedOffline),
                                        modifier =
                                            Modifier.padding(horizontal = 8.dp, vertical = 2.dp))
                                  }
                            }
                          }
                        }
                  }
            }
          }
        }
  }
}
