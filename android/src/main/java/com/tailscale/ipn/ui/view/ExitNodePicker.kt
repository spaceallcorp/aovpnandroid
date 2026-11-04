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
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.outlined.Check
import androidx.compose.material.icons.outlined.Close
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.tailscale.ipn.R
import com.tailscale.ipn.mdm.MDMSettings
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
import com.tailscale.ipn.ui.util.LoadingIndicator
import com.tailscale.ipn.ui.viewModel.ExitNodePickerNav
import com.tailscale.ipn.ui.viewModel.ExitNodePickerViewModel
import com.tailscale.ipn.ui.viewModel.ExitNodePickerViewModelFactory
import kotlinx.coroutines.flow.MutableStateFlow

@Composable
fun ServerVectorIcon(tint: Color, modifier: Modifier = Modifier) {
  Canvas(modifier = modifier) {
    val w = size.width
    val h = size.height
    // Server box 1
    val path1 =
        Path().apply {
          moveTo(w * 0.15f, h * 0.2f)
          lineTo(w * 0.85f, h * 0.2f)
          lineTo(w * 0.85f, h * 0.45f)
          lineTo(w * 0.15f, h * 0.45f)
          close()
        }
    drawPath(path1, color = tint, style = Stroke(width = w * 0.08f))
    drawCircle(color = tint, radius = w * 0.05f, center = Offset(w * 0.3f, h * 0.325f))

    // Server box 2
    val path2 =
        Path().apply {
          moveTo(w * 0.15f, h * 0.55f)
          lineTo(w * 0.85f, h * 0.55f)
          lineTo(w * 0.85f, h * 0.8f)
          lineTo(w * 0.15f, h * 0.8f)
          close()
        }
    drawPath(path2, color = tint, style = Stroke(width = w * 0.08f))
    drawCircle(color = tint, radius = w * 0.05f, center = Offset(w * 0.3f, h * 0.675f))
  }
}

@Composable
fun ExitNodePicker(
    nav: ExitNodePickerNav,
    onCorporateWizard: () -> Unit = {},
    model: ExitNodePickerViewModel = viewModel(factory = ExitNodePickerViewModelFactory(nav))
) {
  LoadingIndicator.Wrap {
    Scaffold(
        containerColor = SpaceDarkBg,
        topBar = { Header(R.string.choose_exit_node, onBack = nav.onNavigateBackHome) }) {
        innerPadding ->
      val tailnetExitNodes by model.tailnetExitNodes.collectAsState()
      val anyActive by model.anyActive.collectAsState()
      val managedByOrganization by model.managedByOrganization.collectAsState()
      val forcedExitNodeId = MDMSettings.exitNodeID.flow.collectAsState().value.value

      LazyColumn(
          modifier = Modifier.padding(innerPadding).padding(horizontal = 16.dp),
          verticalArrangement = Arrangement.spacedBy(12.dp)) {

            // Header info
            item(key = "header") {
              Spacer(modifier = Modifier.height(8.dp))
              Text(
                  text = "Nós de Saída AngolanVPN",
                  style =
                      MaterialTheme.typography.titleLarge.copy(
                          fontWeight = FontWeight.Bold, color = SpaceTextPrimary))
              Text(
                  text = "Selecione o servidor de saída para encaminhamento encriptado",
                  style =
                      MaterialTheme.typography.bodyMedium.copy(
                          color = SpaceTextSecondary))
              Spacer(modifier = Modifier.height(12.dp))

              if (forcedExitNodeId != null) {
                Text(
                    text =
                        managedByOrganization.value?.let {
                          stringResource(R.string.exit_node_mdm_orgname, it)
                        } ?: stringResource(R.string.exit_node_mdm),
                    style = MaterialTheme.typography.bodyMedium,
                    color = SpaceEmeraldLight)
              } else {
                // Option to disable exit node (Nenhum)
                MediumExitNodeCard(
                    title = stringResource(R.string.none),
                    country = "Nenhum nó de saída ativo",
                    isOnline = false,
                    isSelected = !anyActive,
                    isNoneOption = true,
                    onClick = {
                      val noneNode =
                          ExitNodePickerViewModel.ExitNode(
                              label = "none",
                              online = MutableStateFlow(true),
                              selected = !anyActive)
                      model.setExitNode(noneNode)
                    })
              }
            }

            // List of Exit Nodes as Medium Styled Background Cards
            items(tailnetExitNodes, key = { it.id ?: it.label }) { node ->
              val online by node.online.collectAsState()
              val cityName = node.city.ifEmpty { node.label }
              val countryName =
                  if (cityName.contains("Luanda", ignoreCase = true) ||
                      cityName.contains("Benguela", ignoreCase = true) ||
                      cityName.contains("Huila", ignoreCase = true) ||
                      cityName.contains("Angola", ignoreCase = true)) {
                    "Angola"
                  } else {
                    "Servidor Internacional"
                  }

              MediumExitNodeCard(
                  title = cityName,
                  country = countryName,
                  isOnline = online,
                  isSelected = node.selected,
                  onClick = { if (online) model.setExitNode(node) })
            }

            // "É uma empresa?" CTA Card at the bottom
            item(key = "corporate_cta") {
              Spacer(modifier = Modifier.height(16.dp))
              Card(
                  modifier =
                      Modifier.fillMaxWidth()
                          .border(1.dp, SpaceEmeraldPrimary, RoundedCornerShape(20.dp))
                          .clickable { onCorporateWizard() },
                  shape = RoundedCornerShape(20.dp),
                  colors = CardDefaults.cardColors(containerColor = SpaceDarkCard)) {
                    Row(
                        modifier = Modifier.padding(20.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween) {
                          Row(
                              verticalAlignment = Alignment.CenterVertically,
                              modifier = Modifier.weight(1f)) {
                                Box(
                                    modifier =
                                        Modifier.size(44.dp)
                                            .clip(RoundedCornerShape(12.dp))
                                            .background(SpaceEmeraldContainer),
                                    contentAlignment = Alignment.Center) {
                                      BusinessVectorIcon(
                                          tint = SpaceEmeraldPrimary,
                                          modifier = Modifier.size(22.dp))
                                    }

                                Spacer(modifier = Modifier.width(14.dp))

                                Column {
                                  Surface(
                                      shape = RoundedCornerShape(50),
                                      color = SpaceEmeraldPrimary.copy(alpha = 0.15f)) {
                                        Text(
                                            text = "EMPRESAS",
                                            style =
                                                MaterialTheme.typography.labelSmall.copy(
                                                    fontWeight = FontWeight.Bold,
                                                    color = SpaceEmeraldPrimary),
                                            modifier =
                                                Modifier.padding(
                                                    horizontal = 8.dp, vertical = 2.dp))
                                      }
                                  Spacer(modifier = Modifier.height(4.dp))
                                  Text(
                                      text = "É uma empresa?",
                                      style =
                                          MaterialTheme.typography.titleMedium.copy(
                                              fontWeight = FontWeight.Bold, color = SpaceTextPrimary))
                                  Text(
                                      text = "Configurar Interligação Privada L3",
                                      style =
                                          MaterialTheme.typography.bodySmall.copy(
                                              color = SpaceTextSecondary))
                                }
                              }

                          Icon(
                              imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                              contentDescription = null,
                              tint = SpaceEmeraldPrimary,
                              modifier = Modifier.size(20.dp))
                        }
                  }
              Spacer(modifier = Modifier.height(24.dp))
            }
          }
    }
  }
}

@Composable
fun ExitNodeItem(
    viewModel: ExitNodePickerViewModel,
    node: ExitNodePickerViewModel.ExitNode,
) {
  val online by node.online.collectAsState()
  val cityName = node.city.ifEmpty { node.label }
  val countryName = node.country.ifEmpty { "Mullvad Exit Node" }

  MediumExitNodeCard(
      title = cityName,
      country = countryName,
      isOnline = online,
      isSelected = node.selected,
      onClick = { if (online) viewModel.setExitNode(node) })
}

@Composable
fun MediumExitNodeCard(
    title: String,
    country: String,
    isOnline: Boolean,
    isSelected: Boolean,
    isNoneOption: Boolean = false,
    onClick: () -> Unit
) {
  val primaryAccent = if (isNoneOption) SpaceRedOffline else SpaceEmeraldPrimary
  val containerBg = if (isNoneOption) Color(0xFF7F1D1D).copy(alpha = 0.3f) else SpaceEmeraldContainer

  Card(
      modifier =
          Modifier.fillMaxWidth()
              .border(
                  width = if (isSelected) 1.5.dp else 1.dp,
                  color = if (isSelected) primaryAccent else SpaceDarkBorder,
                  shape = RoundedCornerShape(16.dp))
              .clickable { onClick() },
      shape = RoundedCornerShape(16.dp),
      colors =
          CardDefaults.cardColors(
              containerColor = if (isSelected) SpaceDarkSurface else SpaceDarkCard)) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween) {

              Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                Box(
                    modifier =
                        Modifier.size(44.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                if (isSelected) containerBg else SpaceDarkSurface),
                    contentAlignment = Alignment.Center) {
                      if (isNoneOption) {
                        Icon(
                            imageVector = Icons.Outlined.Close,
                            contentDescription = "Desativado",
                            tint = SpaceRedOffline,
                            modifier = Modifier.size(22.dp))
                      } else {
                        ServerVectorIcon(
                            tint = if (isSelected) SpaceEmeraldPrimary else SpaceTextSecondary,
                            modifier = Modifier.size(22.dp))
                      }
                    }

                Spacer(modifier = Modifier.width(14.dp))

                Column {
                  Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier =
                            Modifier.size(8.dp)
                                .clip(CircleShape)
                                .background(
                                    if (isNoneOption) SpaceRedOffline
                                    else if (isOnline) SpaceEmeraldPrimary else SpaceRedOffline))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = title,
                        style =
                            MaterialTheme.typography.titleSmall.copy(
                                fontWeight = FontWeight.Bold, color = SpaceTextPrimary))
                  }

                  Spacer(modifier = Modifier.height(2.dp))

                  Text(
                      text = country,
                      style =
                          MaterialTheme.typography.bodySmall.copy(
                              color = if (isNoneOption) SpaceRedOffline else SpaceEmeraldLight,
                              fontWeight = FontWeight.Medium))
                }
              }

              if (isSelected) {
                Box(
                    modifier =
                        Modifier.size(28.dp)
                            .clip(CircleShape)
                            .background(primaryAccent),
                    contentAlignment = Alignment.Center) {
                      Icon(
                          imageVector = Icons.Outlined.Check,
                          contentDescription = "Selecionado",
                          tint = SpaceDarkBg,
                          modifier = Modifier.size(18.dp))
                    }
              }
            }
      }
}
